import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import {
  openFile,
  byteSize,
  Translate,
  ICrudGetAllAction,
  getSortState,
  IPaginationBaseState,
  JhiPagination,
  JhiItemCount,
  
} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './product.reducer';
import { IProduct } from 'app/shared/model/product.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface IProductProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Product = (props: IProductProps) => {
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );

  const getAllEntities = () => {
    props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const page = params.get('page');
    const sort = params.get('sort');
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [props.location.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === 'asc' ? 'desc' : 'asc',
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const { productList, match, loading, totalItems, isAdmin } = props;
  return (
    <div>
      <h2 id="product-heading">
        <Translate contentKey="storeApp.product.home.title">Products</Translate>
        {isAdmin && <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="storeApp.product.home.createLabel">Create new Product</Translate>
        </Link>
        }
      </h2>
      {/* <div className="table-responsive">
        {productList && productList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('name')}>
                  <Translate contentKey="storeApp.product.name">Name</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('description')}>
                  <Translate contentKey="storeApp.product.description">Description</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('price')}>
                  <Translate contentKey="storeApp.product.price">Price</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('size')}>
                  <Translate contentKey="storeApp.product.size">Size</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('image')}>
                  <Translate contentKey="storeApp.product.image">Image</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="storeApp.product.productCategory">Product Category</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {productList.map((product, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${product.id}`} color="link" size="sm">
                      {product.id}
                    </Button>
                  </td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td>
                    <Translate contentKey={`storeApp.Size.${product.size}`} />
                  </td>
                  <td>
                    {product.image ? (
                      <div>
                        {product.imageContentType ? (
                          <a onClick={openFile(product.imageContentType, product.image)}>
                            <img src={`data:${product.imageContentType};base64,${product.image}`} style={{ maxHeight: '30px' }} />
                            &nbsp;
                          </a>
                        ) : null}
                        <span>
                          {product.imageContentType}, {byteSize(product.image)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>
                    {product.productCategory ? (
                      <Link to={`product-category/${product.productCategory.id}`}>{product.productCategory.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${product.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${product.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${product.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="storeApp.product.home.notFound">No Products found</Translate>
            </div>
          )
        )}
      </div> */}
      <div>
        {productList && productList.length > 0 ? (
          <div>
            <div className="mb-2 d-flex justify-content-end align-items-center">
              <span className="mx-2 col-1">Sort by</span>
                <div className="btn-group" role="group">          
                  <button className="hand btn btn-light" onClick={sort('name')}>
                    <span className="d-flex">
                      <Translate contentKey="storeApp.product.name">Name</Translate> 
                      <FontAwesomeIcon icon="sort" />
                    </span>
                  </button>
                  <button className="hand btn btn-light" onClick={sort('price')}>
                    <span className="d-flex">
                      <Translate contentKey="storeApp.product.price">Price</Translate> 
                      <FontAwesomeIcon icon="sort" />
                    </span>
                  </button>
                  <button className="hand btn btn-light" onClick={sort('size')}>
                    <span className="d-flex">
                      <Translate contentKey="storeApp.product.size">Size</Translate> 
                      <FontAwesomeIcon icon="sort" />
                    </span>
                  </button>
                  <button className="hand btn btn-light" onClick={sort('productCategory')}>
                    <span className="d-flex">
                      <Translate contentKey="storeApp.product.productCategory">Product Category</Translate> 
                      <FontAwesomeIcon icon="sort" />
                    </span>
                  </button>
              </div>
            </div>
            
              {productList.map((product, i) => (
                <div key={`entity-${i}`} className="list-group">
                  <a className="list-group-item list-group-item-action flex-column align-items-start">
                    <div className="row">
                      <div className="col-2 col-xs-12 justify-content-center">
                      {product.image ? (
                        <div>
                          {product.imageContentType ? (
                            <a onClick={openFile(product.imageContentType, product.image)}>
                              <img src={`data:${product.imageContentType};base64,${product.image}`} 
                              style={{ maxHeight: '150px' }} alt="product image"/>
                              &nbsp;
                            </a>
                          ) : null}
                          <span>
                            {product.imageContentType}, {byteSize(product.image)}
                          </span>
                        </div>
                      ) : null}
                      </div>
                      <div className="col col-xs-12">
                        <div className="d-flex justify-content-between">
                        <Link to={`${match.url}/${product.id}`}>
                          <h5 className="mb-1">
                            {product.name}
                          </h5>
                        </Link>
                        <small>
                        {product.productCategory ? (
                          <Link to={`product-category/${product.productCategory.id}`}>
                            {product.productCategory.id}
                          </Link>
                          ) : (
                            ''
                        )}
                        </small>
                      </div>
                      
                        <small className="mb-1">{product.description}</small>
                        <p className="mb-1">Price: {product.price}</p>
                        <small>
                          Size: 
                          <span>
                            <Translate contentKey={`storeApp.Size.${product.size}`} />
                          </span>
                        </small>
                        {isAdmin && <div className="btn-group flex-btn-group-container">
                          
                          <Button
                            tag={Link}
                            to={`${match.url}/${product.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                            color="primary"
                            size="sm"
                          >
                            <FontAwesomeIcon icon="pencil-alt" />{' '}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="entity.action.edit">Edit</Translate>
                            </span>
                          </Button>
                          <Button
                            tag={Link}
                            to={`${match.url}/${product.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                            color="danger"
                            size="sm"
                          >
                            <FontAwesomeIcon icon="trash" />{' '}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="entity.action.delete">Delete</Translate>
                            </span>
                          </Button>
                        </div>
                        }
                        {/* <Button tag={Link} 
                            to={`${match.url}/${product.id}`} 
                            color="info" 
                            size="sm"
                          >
                            <FontAwesomeIcon icon="eye" />{' '}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="entity.action.view">View</Translate>
                            </span>
                          </Button> */}
                      </div>
                    </div>
                  </a>
                </div>
              ))}
        
          </div>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="storeApp.product.home.notFound">No Products found</Translate>
            </div>
          )
        )}
      </div>










      {props.totalItems ? (
        <div className={productList && productList.length > 0 ? '' : 'd-none'}>
          <Row className="justify-content-center">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </Row>
          <Row className="justify-content-center">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={props.totalItems}
            />
          </Row>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

const mapStateToProps = ({ product, authentication }: IRootState) => ({
  productList: product.entities,
  loading: product.loading,
  totalItems: product.totalItems,
  isAdmin: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.ADMIN])
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Product);
