package kr.or.connect.reservation.dao;

import java.util.List;
import javax.sql.DataSource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import kr.or.connect.reservation.dao.sql.CategoryDaoSql;
import kr.or.connect.reservation.dto.Category;

@Repository
public class CategoryDao {
  private NamedParameterJdbcTemplate jdbc;
  private RowMapper<Category> rowMapper = BeanPropertyRowMapper.newInstance(Category.class);

  public CategoryDao(DataSource dataSource) {
    this.jdbc = new NamedParameterJdbcTemplate(dataSource);
  }

  public List<Category> selectAll() {
    return jdbc.query(CategoryDaoSql.SELECT_ALL, rowMapper);
  }
}
