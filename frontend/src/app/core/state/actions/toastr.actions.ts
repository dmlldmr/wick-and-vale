export interface ToastrMessageModel {
  type: 'success' | 'danger' | 'info' | 'warning';
  title?: string;
  message: string;
  delay?: number;
}

export class ToastrAction {
  static readonly type = '[Toastr] Show';
  constructor(public toaster: ToastrMessageModel) {}
}
