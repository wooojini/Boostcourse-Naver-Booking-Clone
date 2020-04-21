package kr.or.connect.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Category {
  @NonNull
  private int id;

  @NonNull
  private String name;

  @NonNull
  private int count;
}
