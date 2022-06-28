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
  static targets = [ "buttonEthConnect", "inputEthAddress", "formNewUser" ]

  connect() {
    this.outputTarget.textContent = 'Hello, Stimulus!'
  }

  ethConnect() {
        // the button to connect to an ethereum wallet
    const buttonEthConnect = document.querySelector('button.eth_connect');

    // the read-only eth address field, we process that automatically
    const formInputEthAddress = document.querySelector('input.eth_address');
    formInputEthAddress.hidden = true;

    // get the user form for submission later
    const formNewUser = document.querySelector('form.new_user');

    // only proceed with ethereum context available
    if (typeof window.ethereum !== 'undefined') {
      buttonEthConnect.addEventListener('click', async () => {
        buttonEthConnect.disabled = true;

        // request accounts from ethereum provider
        const accounts = await this.requestAccounts();
        const etherbase = accounts[0];

        // populate and submit form
        formInputEthAddress.value = etherbase;
        formNewUser.submit();
    });
    } else {
      // disable form submission in case there is no ethereum wallet available
      buttonEthConnect.innerHTML = "No Ethereum Context Available";
      buttonEthConnect.disabled = true;
    }
  }

  // request ethereum wallet access and approved accounts[]
  async requestAccounts() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    return accounts;
  }
}