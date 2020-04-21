package kr.or.connect.reservation.service;

import java.util.List;
import kr.or.connect.reservation.dto.FileInfo;
import kr.or.connect.reservation.dto.Promotion;

public interface PromotionService {
  public List<Promotion> getPromotions();

  public FileInfo getPromotionFileInfo(int productImageId);
}
