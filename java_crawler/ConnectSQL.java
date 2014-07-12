package matan.veg;

import java.math.BigDecimal;
import java.net.*;
import java.io.BufferedWriter;
import java.io.FileWriter;

import java.io.IOException;
import java.io.InputStream;
import java.text.*;
import java.util.Date;
import java.util.Iterator;
import java.util.regex.*;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.mysql.jdbc.PreparedStatement;

import java.sql.*;

public class ConnectSQL {
	private static String PATTERN_DATE = "([0-9]{2}/[0-9]{2}/[0-9]{4})";

	public static Connection connection = null;
	public Statement statement = null;
	public PreparedStatement preparedStatement = null;
	public ResultSet resultSet = null;
	public static BufferedWriter out;
	public void connectToDB() throws Exception {
		try {
			// This will load the MySQL driver, each DB has its own driver
			Class.forName("com.mysql.jdbc.Driver");
			// Setup the connection with the DB
			connection = DriverManager
					.getConnection("jdbc:mysql://localhost/vegdb?useUnicode=yes&characterEncoding=UTF-8&"
							+ "user=matan&password=");
		} catch (Exception e) {
			throw e;
		} 

	}

	public void disconnectFromDB() throws Exception {
		try {
			connection.close();
		}
		catch (Exception e) {
			throw e;
		}
	}


	public void insertPrices(String xlsxUrl, boolean isFirst, boolean isLast) throws IOException, ParseException, SQLException {
		boolean isLastYear = false;
		String lastYear = "אשתקד:";
		DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
		InputStream ExcelFileToRead = new URL(xlsxUrl).openStream();
		XSSFWorkbook  wb = new XSSFWorkbook(ExcelFileToRead);

		XSSFSheet sheet = wb.getSheetAt(0);
		XSSFRow row = sheet.getRow(0);
		XSSFCell cell = row.getCell(1);
		String strDate = cell.getStringCellValue();
		String strFixed = extractWithRegEx(PATTERN_DATE, strDate);
		Date reportDate = df.parse(strFixed);
		java.sql.Date sqlDate = new java.sql.Date(reportDate.getTime());
		if (isFirst) {
			if (dateExists(sqlDate)) {
				System.out.println("Date " + sqlDate.toString() + " Exists in DB, quitting...");
				
				System.exit(0);
			}
		}

		out = new BufferedWriter(new FileWriter(sqlDate+"_daily_log.txt"));
		row = sheet.getRow(6);
		cell = row.getCell(0);
		if (cell.getStringCellValue().equals(lastYear)) {
			isLastYear=true;
		}
		row=sheet.getRow(0);
		Iterator<Row> rows = sheet.rowIterator();

		for (int i=0; i<6; i++) {
			row = (XSSFRow) rows.next();
		}
		String fruitName;
		String stringQuery = 
				"INSERT INTO VegPrices (vegcode, date, price)"
						+ " VALUES (?, ?, ?)";
		PreparedStatement statement = (PreparedStatement) connection.prepareStatement(stringQuery);
		while (rows.hasNext()) {

			cell = row.getCell(0);
			fruitName = cell.getStringCellValue();
			statement.setInt(1, returnVegCode(fruitName));
			statement.setDate(2, sqlDate);
			cell = row.getCell(10);
			statement.setDouble(3,cell.getNumericCellValue());
			statement.addBatch();

			row = (XSSFRow) rows.next();
			if (rows.hasNext() && isLastYear == true) {
				row = (XSSFRow) rows.next();
			}
		}

		statement.executeBatch();
		statement.close();
		
		if (isLast) {
			 stringQuery = "SELECT * FROM VegPrices WHERE Date=? ;";	
			 statement = (PreparedStatement) connection.prepareStatement(stringQuery);
			 statement.setDate(1, sqlDate);
			 ResultSet rs = statement.executeQuery();
			 int previousCode=-1, currentCode=-1,count=1,multiVegCode=0;
			 float sum=0;
			 boolean inMulti = false;
			 while (rs.next()) {
				 currentCode = rs.getInt("VegCode");
				 if (inMulti) {
					 
					 if (currentCode == previousCode) {
						 sum+=rs.getFloat("Price");
						 count++;
						 previousCode=currentCode;
						 System.out.println("Now inMulti, sum = " + sum + "  count = " + count + "  code = " + multiVegCode);
						 out.write("Now inMulti, sum = " + sum + "  count = " + count + "  code = " + multiVegCode+"\n");
					 }
					 else { 
						 
						 stringQuery = "DELETE FROM VegPrices WHERE Date=? AND VegCode=? ;";
						 PreparedStatement multiStatement = (PreparedStatement) connection.prepareStatement(stringQuery);
						 multiStatement.setDate(1, sqlDate);
						 multiStatement.setInt(2, multiVegCode);
						 multiStatement.executeUpdate();
						 stringQuery = "INSERT INTO VegPrices(vegcode, date, price)"
						+ " VALUES (?, ?, ?);";
						 multiStatement = (PreparedStatement) connection.prepareStatement(stringQuery);
						 multiStatement.setInt(1, multiVegCode);
						 multiStatement.setDate(2, sqlDate);
						 multiStatement.setFloat(3,(float) (round(sum/count, 2)));
						 multiStatement.executeUpdate();
						 inMulti = false;
						 sum=0;
						 count=1;
						 previousCode=currentCode;
						 multiVegCode=0;
					 }
				 }
				 else {
					 if (currentCode == previousCode) {
						 inMulti=true;
						 sum+=rs.getFloat("Price");
						 count++;
						 previousCode=currentCode;
						 multiVegCode=currentCode;
						 System.out.println("Now inMulti, sum = " + sum + "  count = " + count + "  code = " + multiVegCode);
						 out.write("Now inMulti, sum = " + sum + "  count = " + count + "  code = " + multiVegCode+"\n");
					 }
					 else {
						 sum=rs.getFloat("Price");
						 previousCode=currentCode;
					 }
				 }
			 }
		}


		out.close();


	}


	public static String extractWithRegEx(String regextype, String input) {
		String matchedString = null;

		if (regextype != null && input != null) {
			Matcher matcher = Pattern.compile(regextype).matcher(input);
			if (matcher.find()) {
				matchedString = matcher.group(0);
				if (matcher.groupCount() > 0) {
					matchedString = matcher.group(1);
				}
			}
		}
		return matchedString;
	}

	private static int returnVegCode(String fruitString) throws SQLException, IOException { // Return VegCode for vegetable String
		String stringQuery = "SELECT VegCode FROM VegLabels WHERE FullName=? ;";
		PreparedStatement statement = (PreparedStatement) connection.prepareStatement(stringQuery);
		statement.setString(1, fruitString);
		ResultSet rs = statement.executeQuery();
		if (rs.next()) {
			return rs.getInt("VegCode");
		}
		else {
			System.out.println("Error: Unknown Vegetable Name: " + fruitString);
			out.write("Error: Unknown Vegetable Name: " + fruitString+"\n");
			stringQuery = "INSERT INTO veglabels (FullName, VegCode) VALUES (?, 0);";
			statement = (PreparedStatement) connection.prepareStatement(stringQuery);
			statement.setString(1, fruitString);
			statement.executeUpdate();
			return 77; // VegCode for unknown fruit
		}
	}


	private static boolean dateExists(java.sql.Date date) throws SQLException { // Check if date allready exists in DB
		String stringQuery = "SELECT * FROM VegPrices WHERE Date=? ;";
		PreparedStatement statement = (PreparedStatement) connection.prepareStatement(stringQuery);
		statement.setDate(1, date);
		ResultSet rs = statement.executeQuery();
		if (!rs.isBeforeFirst() ) {    
			 return false;
		}
		else {
			return true;
		}
	}
	
	public static double round(double d, int decimalPlace) { 
	    BigDecimal bd = new BigDecimal(d);
	    bd = bd.setScale(decimalPlace, BigDecimal.ROUND_HALF_UP);
	    return bd.doubleValue();
	}

}
