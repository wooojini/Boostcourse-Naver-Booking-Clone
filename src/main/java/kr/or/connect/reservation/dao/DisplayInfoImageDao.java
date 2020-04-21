package kr.or.connect.reservation.dao;

import java.util.Collections;
import javax.sql.DataSource;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import kr.or.connect.reservation.dao.sql.DisplayInfoImageDaoSql;
import kr.or.connect.reservation.dto.DisplayInfoImage;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class DisplayInfoImageDao {
  private NamedParameterJdbcTemplate jdbc;
  private RowMapper<DisplayInfoImage> rowMapper =
      BeanPropertyRowMapper.newInstance(DisplayInfoImage.class);

  public DisplayInfoImageDao(DataSource dataSource) {
    this.jdbc = new NamedParameterJdbcTemplate(dataSource);
  }

  public DisplayInfoImage selectByDisplayInfoId(int displayInfoId) {
    DisplayInfoImage displayInfoImage;

    try {
      displayInfoImage = jdbc.queryForObject(DisplayInfoImageDaoSql.SELECT_BY_DISPLAY_INFO_ID,
          Collections.singletonMap("displayInfoId", displayInfoId), rowMapper);
    } catch (EmptyResultDataAccessException e) {
      displayInfoImage = null;
    } catch (Exception e) {
      log.error(e.getMessage());
      displayInfoImage = null;
    }

    return displayInfoImage;
  }
}
