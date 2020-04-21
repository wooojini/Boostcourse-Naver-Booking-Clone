package kr.or.connect.reservation.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.sql.DataSource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;
import kr.or.connect.reservation.dao.sql.CommentImageDaoSql;
import kr.or.connect.reservation.dto.CommentImage;

@Repository
public class CommentImageDao {
  private NamedParameterJdbcTemplate jdbc;
  private RowMapper<CommentImage> rowMapper = BeanPropertyRowMapper.newInstance(CommentImage.class);
  private SimpleJdbcInsert insertAction;

  public CommentImageDao(DataSource dataSource) {
    this.jdbc = new NamedParameterJdbcTemplate(dataSource);
    this.insertAction = new SimpleJdbcInsert(dataSource)
        .withTableName("reservation_user_comment_image").usingGeneratedKeyColumns("id");
  }

  public List<CommentImage> selectByDisplayInfoId(int displayInfoId, int commentId) {
    Map<String, Integer> params = new HashMap<>();
    params.put("displayInfoId", displayInfoId);
    params.put("commentId", commentId);

    return jdbc.query(CommentImageDaoSql.SELECT_COMMENT_IMAGES, params, rowMapper);
  }

  public int insert(int reservationInfoId, int commentId, int fileId) {
    Map<String, Object> params = new HashMap<>();
    params.put("reservation_info_id", reservationInfoId);
    params.put("reservation_user_comment_id", commentId);
    params.put("file_id", fileId);

    return insertAction.executeAndReturnKey(params).intValue();
  }
}
