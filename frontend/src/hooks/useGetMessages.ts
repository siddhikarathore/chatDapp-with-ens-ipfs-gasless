import { getChatContract } from "@/constants/contract";
import { readOnlyProvider, wssProvider } from "@/constants/provider";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";

const useGetMessages = (from: string, to: string) => {
  const [messages, setMessages] = useState([]);

  const [numOfMsgs, setNumOfMsgs] = useState(0);

  const fetchMessages = useCallback(async () => {
    try {
      if (!from || !to) {
        return;
      }
      const contract = getChatContract(readOnlyProvider);
      if (!contract || !contract.getMessagesBetweenUsers) {
        console.error("Contract not initialized properly");
        return;
      }
      const res = await contract.getMessagesBetweenUsers(from, to);
      if (!res) {
        return;
      }
      const converted = res.map((item: [string, string, string]) => ({
        from: item[0],
        to: item[1],
        message: item[2],
      }));
      setMessages(converted);
    } catch (err) {
      console.error(err);
    }
  }, [from, to]);

  const trackingMsgs = useCallback(() => {
    setNumOfMsgs((prevValue) => prevValue + 1);
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    fetchMessages();

    const filter = {
      address: import.meta.env.VITE_CHAT_CONTRACT_ADDRESS,
      topics: [ethers.id("MessageSent(address,address,string)")],
    };

    let provider: ethers.WebSocketProvider | null = null;
    
    try {
      if (import.meta.env.VITE_WEB_SOCKET_RPC_URL) {
        provider = new ethers.WebSocketProvider(
          import.meta.env.VITE_WEB_SOCKET_RPC_URL
        );

        provider.on(filter, trackingMsgs);
      }
    } catch (err) {
      console.error("WebSocket provider error:", err);
    }

    return () => {
      // Perform cleanup
      if (provider) {
        try {
          provider.off(filter, trackingMsgs);
        } catch (err) {
          console.error("Error cleaning up provider:", err);
        }
      }
    };
  }, [fetchMessages, trackingMsgs]);

  return messages;
};

export default useGetMessages;
