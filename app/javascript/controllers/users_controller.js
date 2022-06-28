import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "buttonEthConnect", "inputEthAddress", "formNewUser" ]

  connect() {
    console.log("in users_controller.js")
  }

  initEthConnect() {
    console.log("in tryEthConnect")
    // the read-only eth address field, we process that automatically
    this.inputEthAddressTarget.hidden = true;
    // only proceed with ethereum context available
    if (typeof window.ethereum !== 'undefined') {
      console.log("window.ethereum OK")
      this.ethConnect()
    } else {
      console.log("window.ethereum NOT OK")
      // disable form submission in case there is no ethereum wallet available
      this.buttonEthConnectTarget.innerHTML = "No Ethereum Context Available";
      this.buttonEthConnectTarget.disabled = true;
    }
  }

  async ethConnect() {
    // get the user form for submission later
    this.buttonEthConnectTarget.disabled = true;
    // request accounts from ethereum provider
    const accounts = await this.requestAccounts();
    const etherbase = accounts[0];
    // populate and submit form
    this.inputEthAddressTarget.value = etherbase;
    this.formNewUserTarget.submit();
  }

  // request ethereum wallet access and approved accounts[]
  async requestAccounts() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    return accounts;
  }
}