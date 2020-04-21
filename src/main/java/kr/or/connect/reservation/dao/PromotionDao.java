package kr.or.connect.reservation.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.sql.DataSource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import kr.or.connect.reservation.dao.sql.PromotionDaoSql;
import kr.or.connect.reservation.dto.Promotion;
import kr.or.connect.reservation.type.ImageType;

@Repository
public class PromotionDao {
  private NamedParameterJdbcTemplate jdbc;
  private RowMapper<Promotion> rowMapper = BeanPropertyRowMapper.newInstance(Promotion.class);

  public PromotionDao(DataSource dataSource) {
    this.jdbc = new NamedParameterJdbcTemplate(dataSource);
  }

  public List<Promotion> selectAll() {
    Map<String, String> params = new HashMap<>();
    params.put("imageType", ImageType.THUMBNAIL.getImageTypeName());

    return jdbc.query(PromotionDaoSql.SELECT_ALL, params, rowMapper);
  }
}
