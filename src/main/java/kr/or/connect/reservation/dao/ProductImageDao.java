package kr.or.connect.reservation.dao;

import java.util.Collections;
import java.util.List;
import javax.sql.DataSource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import kr.or.connect.reservation.dao.sql.ProductImageDaoSql;
import kr.or.connect.reservation.dto.ProductImage;

@Repository
public class ProductImageDao {
  private NamedParameterJdbcTemplate jdbc;
  private RowMapper<ProductImage> rowMapper = BeanPropertyRowMapper.newInstance(ProductImage.class);

  public ProductImageDao(DataSource dataSource) {
    this.jdbc = new NamedParameterJdbcTemplate(dataSource);
  }

  public List<ProductImage> selectByDisplayInfoId(int displayInfoId) {
    return jdbc.query(ProductImageDaoSql.SELECT_BY_DISPLAY_INFO_ID,
        Collections.singletonMap("displayInfoId", displayInfoId), rowMapper);
  }
}
