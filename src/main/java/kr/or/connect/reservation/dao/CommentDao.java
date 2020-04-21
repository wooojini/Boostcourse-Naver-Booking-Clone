package kr.or.connect.reservation.dao;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.sql.DataSource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;
import kr.or.connect.reservation.dao.sql.CommentDaoSql;
import kr.or.connect.reservation.dto.Comment;
import kr.or.connect.reservation.dto.param.CommentParam;
import kr.or.connect.reservation.util.DateUtil;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class CommentDao {
  private NamedParameterJdbcTemplate jdbc;
  private RowMapper<Comment> rowMapper = BeanPropertyRowMapper.newInstance(Comment.class);
  private SimpleJdbcInsert insertAction;

  public CommentDao(DataSource dataSource) {
    this.jdbc = new NamedParameterJdbcTemplate(dataSource);
    this.insertAction = new SimpleJdbcInsert(dataSource).withTableName("reservation_user_comment")
        .usingGeneratedKeyColumns("id");
  }

  public List<Comment> selectByDisplayInfoId(int displayInfoId) {
    return jdbc.query(CommentDaoSql.SELECT_COMMENTS_BY_DISPLAY_INFO_ID,
        Collections.singletonMap("displayInfoId", displayInfoId), rowMapper);
  }

  public double selectAvgScoreByDisplayInfoId(int displayInfoId) {
    double avgScore;

    try {
      avgScore = jdbc.queryForObject(CommentDaoSql.SELECT_AVG_SCORE_BY_DISPLAY_INFO_ID,
          Collections.singletonMap("displayInfoId", displayInfoId), Double.class);
    } catch (NullPointerException e) {
      avgScore = 0.0;
    } catch (Exception e) {
      log.error(e.getMessage());
      avgScore = 0.0;
    }

    return avgScore;
  }

  public int insert(CommentParam commentParam) {
    Map<String, Object> params = new HashMap<>();
    params.put("product_id", commentParam.getProductId());
    params.put("reservation_info_id", commentParam.getReservationInfoId());
    params.put("score", commentParam.getScore());
    params.put("comment", commentParam.getComment());
    params.put("create_date", DateUtil.getNowDate());
    params.put("modify_date", DateUtil.getNowDate());

    return insertAction.executeAndReturnKey(params).intValue();
  }
}
