import {ToastrAction, ToastrMessageModel} from './actions/toastr.actions';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Action, State, StateContext} from '@ngxs/store';
import {ToastrService} from 'ngx-toastr';
import {isPlatformBrowser} from '@angular/common';

export interface ToasterStateModel {
  toaster?: ToastrMessageModel;
}

@Injectable()
@State<ToasterStateModel>({
  name: 'ToasterState',
  defaults: {},
})
export class ToasterState {
  constructor(
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  @Action(ToastrAction)
  showToast({ setState }: StateContext<ToasterStateModel>, { toaster }: ToastrAction) {
    setState({ toaster });

    if (!toaster || !isPlatformBrowser(this.platformId)) return;

    const config = {
      timeOut: toaster.delay || 5000,
      positionClass: 'toast-top-center',
      closeButton: true,
      progressBar: true,
    };

    this.toastr.clear();

    switch (toaster.type) {
      case 'success': this.toastr.success(toaster.message, toaster.title, config); break;
      case 'danger':  this.toastr.error(toaster.message, toaster.title, config);   break;
      case 'info':    this.toastr.info(toaster.message, toaster.title, config);    break;
      case 'warning': this.toastr.warning(toaster.message, toaster.title, config); break;
    }
  }
}
