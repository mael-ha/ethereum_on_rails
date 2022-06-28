// Visit The Stimulus Handbook for more details 
// https://stimulusjs.org/handbook/introduction
// 
// This example controller works with specially annotated HTML like:
//
// <div data-controller="hello">
//   <h1 data-target="hello.output"></h1>
// </div>

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "inputEthMessage", "inputEthAddress", "inputEthSignature", "formNewSession", "formNewUser", "buttonEthConnect" ]

  connect() {
    // the read-only eth fields, we process them automatically
    if (this.hasFormNewSessionTarget) {
      console.log("action: NewSession")
      this.inputEthMessageTarget.hidden = true;
      this.inputEthAddressTarget.hidden = true;
      this.inputEthSignatureTarget.hidden = true;
    }
    if (this.hasFormNewUserTarget) {
      console.log("action: NewUser")
      this.inputEthAddressTarget.hidden = true;
    }
    if (typeof window.ethereum !== 'undefined') {
      console.log("window.ethereum OK")
    } else {
      console.log("window.ethereum NOT OK")
      // disable form submission in case there is no ethereum wallet available
      this.buttonEthConnectTarget.innerHTML = "No Ethereum Context Available";
      this.buttonEthConnectTarget.disabled = true;
    }
  }

  async signUpWithEth() {
    // get the user form for submission later
    this.buttonEthConnectTarget.disabled = true;
    // request accounts from ethereum provider
    const accounts = await this.requestAccounts();
    const etherbase = accounts[0];
    // populate and submit form
    this.inputEthAddressTarget.value = etherbase;
    this.formNewUserTarget.submit();
  }

  async signInWithEth() {
    this.buttonEthConnectTarget.disabled = true;
    // request accounts from ethereum provider
    const accounts = await this.requestAccounts();
    const etherbase = accounts[0];
    // sign a message with current time and nonce from database
    const nonce = await this.getUuidByAccount(etherbase);
    if (nonce) {
      const customTitle = "Ethereum on Rails";
      const requestTime = new Date().getTime();
      const message = customTitle + "," + requestTime + "," + nonce;
      const signature = await this.personalSign(etherbase, message);
      // populate and submit form
      this.inputEthMessageTarget.value = message;
      this.inputEthAddressTarget.value = etherbase;
      this.inputEthSignatureTarget.value = signature;
      this.formNewSessionTarget.submit();
    } else {
      // should have some error handling here
      this.inputEthMessageTarget.value = "Please sign up first!";
    }
  }

  // request ethereum wallet access and approved accounts[]
  async requestAccounts() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    return accounts;
  }

  // request ethereum signature for message from account
  async personalSign(account, message) {
    const signature = await ethereum.request({ method: 'personal_sign', params: [ message, account ] });
    return signature;
  }

  // get nonce from /api/v1/users/ by account
  async getUuidByAccount(account) {
    const response = await fetch("/api/v1/users/" + account);
    const nonceJson = await response.json();
    if (!nonceJson) return null;
    const uuid = nonceJson[0].eth_nonce;
    return uuid;
  }
}