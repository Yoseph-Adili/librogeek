package com.librogeek.Repositories;


import com.librogeek.Models.Book;
import com.librogeek.Models.Comment;
import com.librogeek.Models.ShippingInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ShippingInfoRepository extends JpaRepository<ShippingInfo, Integer> {


    List<ShippingInfo> findAllByUserId(Integer userId);
}
