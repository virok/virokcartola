import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { ModalComponent } from 'src/app/components/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private dialog: MatDialog) { }

  minWidth = '50vw';

  public success(message) {
    const config = this.getBaseModalConfig(message);
    //config.data.title = 'Success';
    config.data.theme = 'modal-success';

    return this.openModal(config);
  }

  public error(message) {
    return this.baseErrorModal(message);
  }

  public warning(message) {
    const config = this.getBaseModalConfig(message);
    //config.data.title = 'Warning';
    config.data.theme = 'modal-warning';

    return this.openModal(config);
  }

  public confirm(message, okButtonText, cancelButtonText) {
    const config = this.getBaseModalConfig(message);
    config.disableClose = true;
    //config.data.title = 'Confirm';
    config.data.theme = 'modal-confirm';
    config.data.okButtonText = okButtonText;
    config.data.cancelButtonText = cancelButtonText;
    config.data.showCancelButton = true;

    return this.openModal(config);
  }

  close() {
    this.dialog.closeAll();
  }

  private getBaseModalConfig(content: string) {
    const modalConfig = new MatDialogConfig<any>();
    modalConfig.autoFocus = false;
    modalConfig.disableClose = false;
    modalConfig.minWidth = this.minWidth;
    modalConfig.data = {
      content: content,
      showCancelButton: false,
    };

    return modalConfig;
  }

  private openModal(config: MatDialogConfig<any>) {
    const modal = this.dialog.open(ModalComponent, config);
    return this.getPromiseFromModal(modal);
  }

  private baseErrorModal(message: string, disableClose: boolean = false, isHtmlContent: boolean = false) {
    const config = this.getBaseModalConfig(message);
    config.disableClose = disableClose;
    //config.data.title = 'Error';
    config.data.theme = 'modal-error';
    config.data.isHtmlContent = isHtmlContent;

    return this.openModal(config);
  }

  private getPromiseFromModal<T>(modal: MatDialogRef<T, any>) {
    return new Promise((resolve, reject) => {
      modal.afterClosed()
        .subscribe((result) => {
          if (result) {
            resolve(true);
          } else {

            reject('Cancel button has been clicked');
            /*
            this "reject" above throws an exception on the console if not treated. (I let like this to not break existing code
            that was relying on this).
            example on how to handle it:

            this._modalService
              .confirm(someText, 'Confirm', 'Cancel')
              .then((confirm) => {
                  // do your awesome code here
                });
              }, cancel => console.log(cancel));   <<=== this Catches the error and just print it in the console
            */
          }
        }, (error) => reject(`Error: ${error}`));
    });
  }

}
