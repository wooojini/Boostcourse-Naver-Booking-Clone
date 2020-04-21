package kr.or.connect.reservation.dao.sql;

public class DisplayInfoDaoSql {
  public static final String SELECT_BY_ID =
      "SELECT product.id AS product_id, product.category_id, display_info.id AS display_info_id, category.name AS category_name, description AS product_description, content AS product_content, event AS product_event, opening_hours, place_name, place_lot, place_street, tel AS telephone, homepage, email, display_info.create_date, display_info.modify_date FROM display_info LEFT JOIN product ON display_info.product_id = product.id LEFT JOIN category ON product.category_id = category.id WHERE display_info.id = :displayInfoId";
}
