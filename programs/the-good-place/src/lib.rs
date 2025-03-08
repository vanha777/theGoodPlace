use anchor_lang::prelude::*;

declare_id!("6WQ3EeKJnFj2TbCQPu563WVKhrN5od3VhUZfv66PHiTP");

#[program]
pub mod the_good_place {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
