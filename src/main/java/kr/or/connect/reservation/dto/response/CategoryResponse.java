package kr.or.connect.reservation.dto.response;

import java.util.List;
import kr.or.connect.reservation.dto.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryResponse {
  @NonNull
  List<Category> items;
}
