package kr.or.connect.reservation.dao.sql;

public class CategoryDaoSql {
  public static final String SELECT_ALL =
      "SELECT category.id as id, category.name as name, count(*) as count FROM category LEFT JOIN product ON category.id = product.category_id LEFT JOIN display_info ON product.id = display_info.product_id GROUP BY category.name";
}
