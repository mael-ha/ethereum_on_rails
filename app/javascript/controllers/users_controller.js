import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "buttonEthConnect", "inputEthAddress", "formNewUser" ]

  connect() {
    console.log("in users_controller.js")
  }

  tryEthConnect() {
    console.log("in tryEthConnect")
    // the button to connect to an ethereum wallet
    const buttonEthConnect = this.buttonEthConnectTarget

    // the read-only eth address field, we process that automatically
    const inputEthAddress = this.inputEthAddressTarget
    inputEthAddress.hidden = true;

    // get the user form for submission later
    const formNewUser = this.formNewUserTarget

    // only proceed with ethereum context available
    if (typeof window.ethereum !== 'undefined') {
      console.log("window.ethereum OK")
      this.ethConnect()
    } else {
      console.log("window.ethereum NOT OK")
      // disable form submission in case there is no ethereum wallet available
      buttonEthConnect.innerHTML = "No Ethereum Context Available";
      buttonEthConnect.disabled = true;
    }
  }

  async ethConnect() {
    // get the user form for submission later
    const formNewUser = this.formNewUserTarget
    this.buttonEthConnectTarget.disabled = true;
    // request accounts from ethereum provider
    const accounts = await this.requestAccounts();
    const etherbase = accounts[0];
    // populate and submit form
    this.inputEthAddressTarget.value = etherbase;
    formNewUser.submit();
  }

  // request ethereum wallet access and approved accounts[]
  async requestAccounts() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    return accounts;
  }
}