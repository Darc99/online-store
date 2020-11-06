import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IInvoice } from 'app/shared/model/invoice.model';
import { getEntities as getInvoices } from 'app/entities/invoice/invoice.reducer';
import { getEntity, updateEntity, createEntity, reset } from './shipment.reducer';
import { IShipment } from 'app/shared/model/shipment.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IShipmentUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ShipmentUpdate = (props: IShipmentUpdateProps) => {
  const [invoiceId, setInvoiceId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { shipmentEntity, invoices, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/shipment' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getInvoices();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.date = convertDateTimeToServer(values.date);

    if (errors.length === 0) {
      const entity = {
        ...shipmentEntity,
        ...values,
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="storeApp.shipment.home.createOrEditLabel">
            <Translate contentKey="storeApp.shipment.home.createOrEditLabel">Create or edit a Shipment</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : shipmentEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="shipment-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="shipment-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="trackingCodeLabel" for="shipment-trackingCode">
                  <Translate contentKey="storeApp.shipment.trackingCode">Tracking Code</Translate>
                </Label>
                <AvField id="shipment-trackingCode" type="text" name="trackingCode" />
              </AvGroup>
              <AvGroup>
                <Label id="dateLabel" for="shipment-date">
                  <Translate contentKey="storeApp.shipment.date">Date</Translate>
                </Label>
                <AvInput
                  id="shipment-date"
                  type="datetime-local"
                  className="form-control"
                  name="date"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.shipmentEntity.date)}
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="detailsLabel" for="shipment-details">
                  <Translate contentKey="storeApp.shipment.details">Details</Translate>
                </Label>
                <AvField id="shipment-details" type="text" name="details" />
              </AvGroup>
              <AvGroup>
                <Label for="shipment-invoice">
                  <Translate contentKey="storeApp.shipment.invoice">Invoice</Translate>
                </Label>
                <AvInput id="shipment-invoice" type="select" className="form-control" name="invoice.id">
                  <option value="" key="0" />
                  {invoices
                    ? invoices.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/shipment" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  invoices: storeState.invoice.entities,
  shipmentEntity: storeState.shipment.entity,
  loading: storeState.shipment.loading,
  updating: storeState.shipment.updating,
  updateSuccess: storeState.shipment.updateSuccess,
});

const mapDispatchToProps = {
  getInvoices,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ShipmentUpdate);
