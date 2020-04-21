package kr.or.connect.reservation.util;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DateUtil {
  private static final Pattern yearMonthDayFormatPattern = Pattern.compile("y{4,}-M{2}-d{2}");
  private static final Pattern monthPattern = Pattern.compile("-[0-1][0-9]-");
  private static final Pattern dayPattern = Pattern.compile("(?:[0-3][0-9])$");

  public static String getNowDate() {
    return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
  }

  public static String getNowYearMonthDay(String dateFormat) {
    validDateFormat(dateFormat);

    String dateStr = new SimpleDateFormat(dateFormat).format(new Date());
    return dateStr;
  }

  public static String getRandomYearMonthDay(String dateFormat) {
    validDateFormat(dateFormat);

    String nowYearMonthDay = getNowYearMonthDay(dateFormat);
    int month = Integer.parseInt(findMonthInYearMonthDay(nowYearMonthDay));
    int day = Integer.parseInt(findDayInYearMonthDay(nowYearMonthDay));
    int lastDayOfMonth = Calendar.getInstance().getActualMaximum(Calendar.DATE);

    int randomDay = (new Random().nextInt(5)) + day;
    if (randomDay > lastDayOfMonth) {
      randomDay -= lastDayOfMonth;
      month = (month + 1) % 13;
      if (month == 0) {
        month = 1;
      }
    }

    String regex = "([0-9]+)-([0-1][0-9])-([0-3][0-9])$";
    String replacement = "$1." + Integer.toString(month) + "." + Integer.toString(randomDay);
    String randomYearMonthDay = nowYearMonthDay.replaceFirst(regex, replacement);

    return randomYearMonthDay;
  }

  private static String findMonthInYearMonthDay(String yearMonthDay) {
    String month;
    Matcher matcher = monthPattern.matcher(yearMonthDay);
    if (matcher.find()) {
      month = matcher.group();
      month = month.replaceAll("-", "");
    } else {
      throw new RuntimeException("Not found month exception in yearMonthDay String");
    }

    return month;
  }

  private static String findDayInYearMonthDay(String yearMonthDay) {
    String day;
    Matcher matcher = dayPattern.matcher(yearMonthDay);
    if (matcher.find()) {
      day = matcher.group();
    } else {
      throw new RuntimeException("Not found day exception in yearMonthDay String");
    }

    return day;
  }

  private static void validDateFormat(String dateFormat) {
    Matcher matcher = yearMonthDayFormatPattern.matcher(dateFormat);

    if (!matcher.find()) {
      throw new IllegalArgumentException("Invalid dateFormat argument exception");
    }
  }
}
