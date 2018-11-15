import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the InfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {

	hash:any;
	data:any;
	from: any;
	to: any;
	nonce: any;
	value: any;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	console.log(JSON.stringify(this.navParams.data));
  	this.hash = this.navParams.data['hash'];
  	this.data = this.navParams.data['input'];
  	this.from = this.navParams.data['from'];
  	this.to = this.navParams.data['to'];
  	this.nonce = this.navParams.data['nonce'];
  	this.value = this.navParams.data['value'];
  }

  ionViewDidLoad() {
    // this.hash = this.param.hash;

  }

}
