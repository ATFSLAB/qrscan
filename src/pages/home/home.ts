import { Component } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';

// Camera support & Barcode Scanner

import { HTTP } from '@ionic-native/http';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { InfoPage } from '../info/info';

const DATA_HOST = 'http://qrs.atfslab.io/';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	codeRead: any;
	items: any;

	constructor(public navCtrl: NavController,
		private alerts: AlertController,
		private modals: ModalController,
		private requests: HTTP,
		private barcodeScanner: BarcodeScanner) {
	}

	checkHashValidate(hash) {
		return hash.match(/^0x/);
	}


	listItems() {
		this.requests.get(DATA_HOST, {}, {})
			.then(((rs) => {
				// this.simpleDlg('request success', rs.data);
				this.items = [];
				JSON.parse(rs.data).forEach(((item) => {
					this.items.push({
						hash: item[0],
						datetime: (parseFloat(item[1])*1000)
					});
				}).bind(this));
			}).bind(this))
			.catch(((err) => {
				this.simpleDlg('NETWORK Error', err);
			}).bind(this));
	}

	onListItemSelected(hash) {
		this.requests.get(DATA_HOST+hash, {}, {})
			.then(((rs) => {
				let _data = JSON.parse(rs.data).data;
				//console.log(JSON.stringify(_data));

				this.modals.create(InfoPage, _data).present();
				//this.simpleDlg(_data['#'], _data.input);
			}).bind(this))
			.catch(((err) => {
				this.simpleDlg('NETWORK Error', err);
			}).bind(this));
	}

	onListItemSearch() {
		if(!this.codeRead) return;
		let _path = '+/'+this.codeRead;
		this.requests.get(DATA_HOST+_path, {}, {})
			.then((rs) => {
				let _data = JSON.parse(rs.data);
				let _hash = _data['#'];
				this.items.push({
					hash: _hash,
					datetime: 0
				});

				this.onListItemSelected(_hash);
			})
			.catch(((err) => {
				this.simpleDlg('NETWORK Error', err);
			}).bind(this));
	}

	simpleDlg(title, msg) {
		this.alerts.create({
			title: title,
			message: msg,
			buttons: [{
				text: 'OK',
				role: 'cancel',
			}]
		}).present();
	}

	openScanner() {
		this.barcodeScanner.scan()
			.then(((code) => {
				if(this.checkHashValidate(code.text)) {
					this.codeRead = code.text;
					this.onListItemSearch();
				} else {
					this.simpleDlg('Invalid Code', JSON.stringify(code));
				}
				
				// this.codeType = code.format;
			}).bind(this))
			.catch(((err) => {
				this.simpleDlg('Scan Error', err);
			}).bind(this));
	}
}
