package kr.or.connect.reservation.type;

public enum CategoryType {
  ALL(0), DISPLAY(1), MUSICAL(2), CONCERT(3), CLASSIC(4), PLAY(5);

  private final int categoryId;

  private CategoryType(int categoryId) {
    this.categoryId = categoryId;
  }

  public int getCategoryId() {
    return this.categoryId;
  }
}
