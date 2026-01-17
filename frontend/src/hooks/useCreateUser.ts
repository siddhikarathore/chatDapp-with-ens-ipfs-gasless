/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { isSupportedChain } from "@/util";
import { getProvider } from "@/constants/provider";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import ensAbi from "@/constants/ensAbi.json";

const useCreateUser = (address: any, url: string, username: string) => {
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const navigate = useNavigate();

  return useCallback(async () => {
    if (!isSupportedChain(chainId))
      return toast.error("Wrong network !", {
        position: "top-right",
      });

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();

    const toastId = toast.loading("Registering...", {
      position: "top-right",
    });

    const registrationTx = {
      from: address,
      avatar: url,
      name: username,
    };

    try {
      // Pre-check username availability to avoid contract revert and 500
      try {
        const readOnly = new ethers.JsonRpcProvider(import.meta.env.VITE_INFURA_RPC_URL);
        const ensContract = new ethers.Contract(
          import.meta.env.VITE_ENS_CONTRACT_ADDRESS,
          ensAbi as any,
          readOnly
        );
        const taken = await ensContract.usernameExist(username);
        if (taken) {
          toast.dismiss(toastId);
          return toast.error("Username not available", { position: "top-right" });
        }
      } catch (_) {
        // If pre-check fails, continue; server will validate
      }

      const signature = await signer.signMessage(
        JSON.stringify(registrationTx)
      );

      const relayerUrl = import.meta.env.VITE_RELAYER_URL || "http://localhost:5000";
      const response = await fetch(
        `${relayerUrl}/register-user`,
        {
          method: "POST",
          body: JSON.stringify({ ...registrationTx, signature }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let jsonResponse: any = { success: false, message: "UNKNOWN_ERROR" };
      try {
        jsonResponse = await response.json();
      } catch (_) {
        // Non-JSON response from server
        try {
          const text = await response.text();
          console.error("Relayer non-JSON response:", text);
        } catch {}
      }

      if (response.ok && jsonResponse.success) {
        toast.dismiss(toastId);
        navigate("/chat");
        return toast.success(jsonResponse.message, {
          position: "top-right",
        });
      } else {
        toast.dismiss(toastId);
        console.error("Relayer error:", response.status, jsonResponse);
        if (response.status === 400) {
          const msg = (jsonResponse.message || "").toString();
          if (msg.includes("NAME_NOT_AVAILABLE")) {
            return toast.error("Username not available", { position: "top-right" });
          }
          if (msg.includes("INSUFFICIENT_FUNDS")) {
            const relayer = jsonResponse?.details?.relayer;
            return toast.error(
              `Relayer needs MATIC on Polygon Amoy. Address: ${relayer ?? "unknown"}`,
              { position: "top-right" }
            );
          }
          return toast.error(jsonResponse.message ?? "Validation failed", {
            position: "top-right",
          });
        }
        navigate("/signup");
        return toast.error(jsonResponse.message ?? "Registration failed", {
          position: "top-right",
        });
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      navigate("/signup");
      toast.error("OOPS!! SOMETHING_WENT_WRONG", {
        position: "top-right",
      });
    }
  }, [username, url, address, chainId, walletProvider, navigate]);
};

export default useCreateUser;
