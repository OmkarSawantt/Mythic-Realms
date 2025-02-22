import React from "react";
import { PageHOC, CardNew } from "../components";
import { useGlobalContext } from "../context";
import styles from "../styles";
import { ethers } from "ethers"; // Import ethers for BigNumber handling

const Tokens = () => {
  const { contract, player ,tokens } = useGlobalContext();



  // Convert BigNumbers to numbers before passing them to CardNew
  const formattedTokens = tokens.map((token) => ({
    ...token,
    attackStrength: ethers.BigNumber.from(token.attackStrength).toNumber(),
    defenseStrength: ethers.BigNumber.from(token.defenseStrength).toNumber(),
    id: ethers.BigNumber.from(token.id).toNumber(),
    tokenHash: ethers.BigNumber.from(token.tokenHash).toNumber(),
  }));

  console.log(formattedTokens);

  const handleClick = async () => {
    try {
      const token = await contract.createRandomGameToken(player.playerName);
      console.log("Token created:", token);
    } catch (error) {
      console.error("Error creating token:", error);
    }
  };

  return (
    <div>
      {formattedTokens.length === 0 && (
        <div>
          <p className={styles.label}>
            You don't have a token. Please create a new random token.
          </p>
          <button onClick={handleClick} className="button">
            Create Token
          </button>
        </div>
      )}

      {formattedTokens.length > 0 && (
        <div className="flex flex-row flex-wrap relative justify-center overflow-y-auto h-full max-h-96 ">
          {formattedTokens.map((token, index) => (
            <CardNew card={token} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PageHOC(Tokens, <>Card Management</>, <></>);
