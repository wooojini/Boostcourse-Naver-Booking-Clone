package kr.or.connect.reservation.type;

public enum ImageType {
  THUMBNAIL("th"), MAIN("ma"), ETC("et");

  private final String imageTypeName;

  ImageType(String imageTypeName) {
    this.imageTypeName = imageTypeName;
  }

  public String getImageTypeName() {
    return this.imageTypeName;
  }

  public static boolean hasImageTypeName(String imageTypeName) {
    ImageType[] imageTypes = ImageType.values();
    for (ImageType imageType : imageTypes) {
      if (imageType.getImageTypeName().equals(imageTypeName)) {
        return true;
      }
    }

    return false;
  }

  public static ImageType valueOfImageTypeName(String imageTypeName) {
    ImageType[] imageTypes = ImageType.values();
    for (ImageType imageType : imageTypes) {
      if (imageType.getImageTypeName().equals(imageTypeName)) {
        return imageType;
      }
    }

    return null;
  }

}
