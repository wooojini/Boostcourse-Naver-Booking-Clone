package kr.or.connect.reservation.dao;

import java.util.HashMap;
import java.util.Map;
import javax.sql.DataSource;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;
import kr.or.connect.reservation.dao.sql.FileInfoDaoSql;
import kr.or.connect.reservation.dto.FileInfo;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class FileInfoDao {
  private NamedParameterJdbcTemplate jdbc;
  private RowMapper<FileInfo> rowMapper = BeanPropertyRowMapper.newInstance(FileInfo.class);
  private SimpleJdbcInsert insertAction;

  public FileInfoDao(DataSource dataSource) {
    this.jdbc = new NamedParameterJdbcTemplate(dataSource);
    this.insertAction =
        new SimpleJdbcInsert(dataSource).withTableName("file_info").usingGeneratedKeyColumns("id");
  }

  public int insert(FileInfo fileInfo) {
    SqlParameterSource params = new BeanPropertySqlParameterSource(fileInfo);
    return insertAction.executeAndReturnKey(params).intValue();
  }

  public FileInfo selectByProductImageId(int productImageId) {
    FileInfo fileInfo;

    try {
      Map<String, Object> params = new HashMap<>();
      params.put("productImageId", productImageId);

      fileInfo = jdbc.queryForObject(FileInfoDaoSql.SELECT_BY_PRODUCT_IMAGE_ID, params, rowMapper);
    } catch (EmptyResultDataAccessException e) {
      fileInfo = null;
    } catch (Exception e) {
      log.error(e.getMessage());
      fileInfo = null;
    }

    return fileInfo;
  }

  public FileInfo selectByDisplayInfoImageId(int displayInfoImageId) {
    FileInfo fileInfo;

    try {
      Map<String, Object> params = new HashMap<>();
      params.put("displayInfoImageId", displayInfoImageId);

      fileInfo =
          jdbc.queryForObject(FileInfoDaoSql.SELECT_BY_DISPLAY_INFO_IMAGE_ID, params, rowMapper);
    } catch (EmptyResultDataAccessException e) {
      fileInfo = null;
    } catch (Exception e) {
      log.error(e.getMessage());
      fileInfo = null;
    }

    return fileInfo;
  }

  public FileInfo selectByCommentImageId(int commentImageId) {
    FileInfo fileInfo;

    try {
      Map<String, Object> params = new HashMap<>();
      params.put("commentImageId", commentImageId);

      fileInfo = jdbc.queryForObject(FileInfoDaoSql.SELECT_BY_COMMENT_IMAGE_ID, params, rowMapper);
    } catch (EmptyResultDataAccessException e) {
      fileInfo = null;
    } catch (Exception e) {
      log.error(e.getMessage());
      fileInfo = null;
    }

    return fileInfo;
  }
}
