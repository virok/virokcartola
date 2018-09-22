import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent implements OnInit {
  title: string;
  content: string;
  cancelButtonText = 'Cancel';
  okButtonText = 'OK';
  isHtmlContent = false;
  theme: string;
  showTitle = true;
  showCancelButton = true;
  showOkButton = true;

  constructor(@Inject(MAT_DIALOG_DATA) public _data: DialogData,
    protected domSanitizer: DomSanitizer) {
  }

  ngOnInit() {
    if (this._data) {
      if (this._data.isHtmlContent != null) {
        this.isHtmlContent = this._data.isHtmlContent;
      }

      if (this._data.title) {
        this.title = this._data.title;
      }

      if (this._data.content != null) {
        this.content = this._data.isHtmlContent ?
          this.domSanitizer.bypassSecurityTrustHtml(this._data.content) :
          this._data.content;
      }

      if (this._data.cancelButtonText != null) {
        this.cancelButtonText = this._data.cancelButtonText;
      }

      if (this._data.showCancelButton != null) {
        this.showCancelButton = this._data.showCancelButton;
      }

      if (this._data.okButtonText != null) {
        this.okButtonText = this._data.okButtonText;
      }

      if (this._data.showOkButton != null) {
        this.showOkButton = this._data.showOkButton;
      }

      if (this._data.theme != null) {
        this.theme = this._data.theme;
      }

      this.showTitle = this.title != null;
    }
  }
}

export interface DialogData {
  title;
  content;
  cancelButtonText;
  okButtonText;
  theme;
  isHtmlContent;
  showCancelButton;
  showOkButton;
}
