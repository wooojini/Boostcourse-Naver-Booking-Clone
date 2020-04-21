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
import kr.or.connect.reservation.dao.sql.ReservationInfoDaoSql;
import kr.or.connect.reservation.dto.ReservationInfo;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class ReservationInfoDao {
  private NamedParameterJdbcTemplate jdbc;
  private RowMapper<ReservationInfo> rowMapper =
      BeanPropertyRowMapper.newInstance(ReservationInfo.class);
  private SimpleJdbcInsert insertAction;

  public ReservationInfoDao(DataSource dataSource) {
    this.jdbc = new NamedParameterJdbcTemplate(dataSource);
    this.insertAction = new SimpleJdbcInsert(dataSource).withTableName("reservation_info")
        .usingGeneratedKeyColumns("id").usingColumns("product_id", "display_info_id",
            "reservation_name", "reservation_tel", "reservation_email", "reservation_date",
            "create_date", "modify_date");

  }

  public List<ReservationInfo> selectByEmail(String reservationEmail) {
    return jdbc.query(ReservationInfoDaoSql.SELECT_BY_EMAIL,
        Collections.singletonMap("reservationEmail", reservationEmail), rowMapper);
  }

  public int selectTotalPrice(String reservationEmail, int productId, int displayInfoId,
      String reservationDate) {
    int totalPrice;

    try {
      Map<String, Object> params = new HashMap<>();
      params.put("reservationEmail", reservationEmail);
      params.put("productId", productId);
      params.put("displayInfoId", displayInfoId);
      params.put("reservationDate", reservationDate);

      totalPrice =
          jdbc.queryForObject(ReservationInfoDaoSql.SELECT_TOTAL_PRICE, params, Integer.class);
    } catch (NullPointerException e) {
      totalPrice = 0;
    } catch (Exception e) {
      log.error(e.getMessage());
      totalPrice = 0;
    }

    return totalPrice;
  }

  public int selectIdByEmail(String reservationEmail) {
    int id;

    try {
      id = jdbc.queryForObject(ReservationInfoDaoSql.SELECT_ID_BY_EMAIL,
          Collections.singletonMap("reservationEmail", reservationEmail), Integer.class);
    } catch (NullPointerException e) {
      id = 0;
    } catch (Exception e) {
      log.error(e.getMessage());
      id = 0;
    }

    return id;
  }

  public int updateCancelFlagById(int reservationInfoId, boolean cancelFlag, String modifyDate) {
    Map<String, Object> params = new HashMap<>();
    params.put("reservationInfoId", reservationInfoId);
    params.put("cancelFlag", cancelFlag);
    params.put("modifyDate", modifyDate);

    return jdbc.update(ReservationInfoDaoSql.UPDATE_CANCEL_FLAG_BY_ID, params);
  }

  public int insert(ReservationInfo reservationInfo) {
    Map<String, Object> params = new HashMap<>();
    params.put("product_id", reservationInfo.getProductId());
    params.put("display_info_id", reservationInfo.getDisplayInfoId());
    params.put("reservation_name", reservationInfo.getReservationName());
    params.put("reservation_tel", reservationInfo.getReservationTelephone());
    params.put("reservation_email", reservationInfo.getReservationEmail());
    params.put("reservation_date", reservationInfo.getReservationDate());
    params.put("create_date", reservationInfo.getCreateDate());
    params.put("modify_date", reservationInfo.getModifyDate());

    return insertAction.executeAndReturnKey(params).intValue();
  }
}
