import { Moment } from 'moment';
import { IShipment } from 'app/shared/model/shipment.model';
import { IProductOrder } from 'app/shared/model/product-order.model';
import { InvoiceStatus } from 'app/shared/model/enumerations/invoice-status.model';
import { PaymentMethod } from 'app/shared/model/enumerations/payment-method.model';

export interface IInvoice {
  id?: number;
  date?: string;
  details?: string;
  status?: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  paymentDate?: string;
  paymentAmount?: number;
  shipments?: IShipment[];
  order?: IProductOrder;
}

export const defaultValue: Readonly<IInvoice> = {};
