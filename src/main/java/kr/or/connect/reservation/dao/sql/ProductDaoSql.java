package kr.or.connect.reservation.dao.sql;

public class ProductDaoSql {
  public static final String SELECT_PRODUCTS_ALL =
      "SELECT product.id as product_id, product.description as product_description, product.content as product_content, display_info.id as display_info_id, display_info.place_name as place_name, file_info.save_file_name as product_image_url, product_image.id as product_image_id FROM product LEFT JOIN display_info ON product.id = display_info.product_id LEFT JOIN product_image ON product.id = product_image.product_id LEFT JOIN file_info ON product_image.file_id = file_info.id WHERE product_image.type = :imageType ORDER BY product.id limit :start, :limit";

  public static final String SELECT_PRODUCTS_BY_CATEGORY_ID =
      "SELECT product.id as product_id, product.description as product_description, product.content as product_content, display_info.id as display_info_id, display_info.place_name as place_name, file_info.save_file_name as product_image_url, product_image.id as product_image_id FROM product LEFT JOIN display_info ON product.id = display_info.product_id LEFT JOIN product_image ON product.id = product_image.product_id LEFT JOIN file_info ON product_image.file_id = file_info.id WHERE product.category_id = :categoryId AND product_image.type = :imageType ORDER BY product.id limit :start, :limit";

  public static final String SELECT_COUNT_ALL =
      "SELECT count(*) FROM product LEFT JOIN display_info ON product.id = display_info.product_id ";

  public static final String SELECT_COUNT_BY_CATEGORY_ID =
      "SELECT count(*) FROM product LEFT JOIN display_info ON product.id = display_info.product_id WHERE product.category_id = :categoryId";
}
