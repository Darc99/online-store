package com.darc.store.repository;

import com.darc.store.domain.ProductOrder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the ProductOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductOrderRepository extends JpaRepository<ProductOrder, Long> {
  Page<ProductOrder> findAllByCustomerUserLogin(String login, Pageable pageable);

  Optional<ProductOrder> findOneByIdAndCustomerUserLogin(Long id, String login);
}
