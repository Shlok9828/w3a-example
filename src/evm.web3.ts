import type { IProvider } from "@web3auth/base";
import Web3 from "web3";

export default class EthereumRpc {
  private provider: IProvider;

  constructor(provider: IProvider) {
    this.provider = provider;
  }
  async getAccounts(): Promise<string[]> {
    try {
      const web3 = new Web3(this.provider as any);
      const accounts = await web3.eth.getAccounts();
      return accounts;
    } catch (error: unknown) {
      return error as string[];
    }
  }

  async getBalance(): Promise<string> {
    try {
      const web3 = new Web3(this.provider as any);
      const accounts = await web3.eth.getAccounts();
      const balance = await web3.eth.getBalance(accounts[0]);
      return balance.toString();
    } catch (error) {
      return error as string;
    }
  }

  async getChainId(): Promise<string> {
    try {
      const web3 = new Web3(this.provider as any);

      // Get the connected Chain's ID
      const chainId = await web3.eth.getChainId();

      return chainId.toString();
    } catch (error) {
      return error as string;
    }
  }

  async signMessage(): Promise<string | undefined> {
    try {
      const web3 = new Web3(this.provider as any);
      const accounts = await web3.eth.getAccounts();
      const message =
        "0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad";
      (web3.currentProvider as any)?.send(
        {
          method: "eth_sign",
          params: [accounts[0], message],
          from: accounts[0],
        },
        (err: Error, result: any) => {
          if (err) {
            return console.error(err);
          }
          return result;
        }
      );
    } catch (error) {
      return error as string;
    }
    return;
  }

  async sendTransaction(): Promise<string> {
    try {
      const web3 = new Web3(this.provider as any);
      const accounts = await web3.eth.getAccounts();

      const txRes = await web3.eth.sendTransaction({
        from: accounts[0],
        to: accounts[0],
        value: web3.utils.toWei("0.01", "ether"),
      });
      return txRes.transactionHash.toString();
    } catch (error) {
      return error as string;
    }
  }
}
