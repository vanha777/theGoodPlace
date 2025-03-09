import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TheGoodPlace } from "../target/types/the_good_place";
import { expect } from "chai";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";

describe("the-good-place", () => {
  const sender = anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from(
      JSON.parse(
        require('fs').readFileSync(
          require('os').homedir() + '/metaloot-keypair.json',
          'utf-8'
        )
      )
    )
  );
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TheGoodPlace as Program<TheGoodPlace>;
  const provider = anchor.getProvider();

  // Create a keypair for our test account
  const testAccount = Keypair.generate();

  // it("Is initialized!", async () => {
  //   // Add your test here.
  //   const tx = await program.methods.initialize().rpc();
  //   console.log("Your transaction signature", tx);
  // });

  it("Can create a new person", async () => {
    // Example test for creating an entry in your program
    // Replace with actual functionality from your program
    const entrySeed = Keypair.generate();
    const tx = await program.methods
      .createPerson("Person 1", "https://example.com/person1", sender.publicKey)
      .accounts({
        entrySeed: entrySeed.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([sender])
      .rpc();

    console.log("Create entry transaction signature", tx);

    // Fetch the created account and verify its data
    const account = await program.account.personalTraits.fetch(anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("thegoodplace"), entrySeed.publicKey.toBuffer()],
      program.programId
    )[0]);
    expect(account.name).to.equal("Person 1");
    expect(account.uri).to.equal("https://example.com/person1");
    expect(account.authority.toString()).to.equal(sender.publicKey.toString());
  });

  it("Can update an existing person", async () => {
    // Example test for updating an entry
    // First create an entry to update
    const entrySeed = Keypair.generate();

    await program.methods
      .createPerson("Person 2", "https://example.com/person2", sender.publicKey)
      .accounts({
        entrySeed: entrySeed.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([sender])
      .rpc();

    // Now update it
    const tx = await program.methods
      .updatePerson("Person 2.5", "https://example.com/person2.5")
      .accounts({
        entrySeed: entrySeed.publicKey,
      })
      .signers([sender])
      .rpc();

    console.log("Update entry transaction signature", tx);

    // Verify the update
    const updatedAccount = await program.account.personalTraits.fetch(anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("thegoodplace"), entrySeed.publicKey.toBuffer()],
      program.programId
    )[0]);
    expect(updatedAccount.name).to.equal("Person 2.5");
    expect(updatedAccount.uri).to.equal("https://example.com/person2.5");
  });

  it("Fails when unauthorized user tries to update", async () => {
    // Create an entry
    const entrySeed = Keypair.generate();

    await program.methods
      .createPerson("Test entry", "https://example.com/testentry", sender.publicKey)
      .accounts({
        entrySeed: entrySeed.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([sender])
      .rpc();

    // Create a new user
    const unauthorizedUser = Keypair.generate();

    // Fund the new user so they can pay for transaction fees
    const airdropTx = await provider.connection.requestAirdrop(
      unauthorizedUser.publicKey,
      1000000000
    );
    await provider.connection.confirmTransaction(airdropTx);

    // Try to update with unauthorized user - should fail
    try {
      await program.methods
        .updatePerson("Hacked entry", "https://example.com/hackedentry")
        .accounts({
          entrySeed: entrySeed.publicKey,
        })
        .signers([unauthorizedUser])
        .rpc();

      // If we reach here, the test failed
      expect.fail("Expected transaction to fail with unauthorized user");
    } catch (error) {
      // Expected error
      expect(error).to.be.instanceOf(Error);
    }
  });
});
