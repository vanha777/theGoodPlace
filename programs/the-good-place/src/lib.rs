use anchor_lang::prelude::*;

declare_id!("6WQ3EeKJnFj2TbCQPu563WVKhrN5od3VhUZfv66PHiTP");

#[program]
pub mod the_good_place {
    use super::*;

    pub fn create_person(
        ctx: Context<CreatePersonalTraits>,
        name: String,
        uri: String,
        authority: Pubkey,
    ) -> Result<()> {
        // Store the entry data
        let entry_account = &mut ctx.accounts.pda;
        let metadata = PersonalTraits {
            name,
            uri,
            authority,
            bump: ctx.bumps.pda,
        };
        entry_account.set_inner(metadata);
        msg!(
            "Person created successfully with entry PDA: {}",
            ctx.accounts.pda.key()
        );
        Ok(())
    }

    pub fn update_person(
        ctx: Context<UpdatePersonalTraits>,
        name: String,
        uri: String,
    ) -> Result<()> {
        let entry_account = &mut ctx.accounts.pda;

        // Update fields if provided
        if !name.trim().is_empty() {
            entry_account.name = name;
        }
        if !uri.trim().is_empty() {
            entry_account.uri = uri;
        }
        // if nft_collection != Pubkey::default() {
        //     entry_account.nft_collection = nft_collection;
        // }

        // entry_account.nft_collection = nft_collection;

        msg!("Game studio metadata updated successfully");
        Ok(())
    }
}

#[account]
#[derive(Default)]
pub struct PersonalTraits {
    pub name: String,
    pub uri: String,
    pub authority: Pubkey,
    pub bump: u8,
}

#[derive(Accounts)]
#[instruction(
    name: String,
    uri: String,
    authority: Pubkey,
)]
pub struct CreatePersonalTraits<'info> {
    #[account(
        mut,
        constraint = payer.key() == authority @ ErrorCode::ConstraintOwner
    )]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = 8  // discriminator
            + 4 + 32  // name (String - 4 bytes for length + max 32 bytes for content)
            + 4 + 200 // uri (String - 4 bytes for length + max 200 bytes for content)
            + 32      // authority (Pubkey)
            + 1,      // bump (u8)
        seeds = [b"thegoodplace", entry_seed.key().as_ref()],
        bump
    )]
    pub pda: Account<'info, PersonalTraits>,

    /// CHECK: This is safe as we're just using it as a reference for PDA seeds
    pub entry_seed: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePersonalTraits<'info> {
    #[account(
        mut,
        constraint = payer.key() == pda.authority @ ErrorCode::ConstraintOwner
    )]
    pub payer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"thegoodplace", entry_seed.key().as_ref()],
        bump = pda.bump,
        constraint = !pda.name.trim().is_empty() @ ErrorCode::ConstraintAccountIsNone
    )]
    pub pda: Account<'info, PersonalTraits>,
    /// CHECK: This is safe as we're just using it as a reference for PDA seeds
    pub entry_seed: AccountInfo<'info>,
}
