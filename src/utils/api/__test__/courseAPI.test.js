import { courseAPI } from "../courseApi";
import { COURSES } from "../apiEndpoints";
import apiClient from "../apiClient";

jest.mock("../apiClient");

describe("courseAPI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createCourse calls POST and returns data", async () => {
    const mockData = { id: 1, title: "React Course" };
    apiClient.post.mockResolvedValue({ data: mockData });

    const result = await courseAPI.createCourse(mockData);

    expect(apiClient.post).toHaveBeenCalledWith(COURSES.createCourse, mockData);
    expect(result).toEqual(mockData);
  });

  test("updateCourse calls PUT and returns data", async () => {
    const mockData = { title: "Updated Course" };
    apiClient.put.mockResolvedValue({ data: mockData });

    const result = await courseAPI.updateCourse(1, mockData);

    expect(apiClient.put).toHaveBeenCalledWith(
      `${COURSES.createCourse}/1`,
      mockData
    );
    expect(result).toEqual(mockData);
  });

  test("updateStudentCount calls PATCH and returns data", async () => {
    const mockData = { students: 201 };

    apiClient.patch.mockResolvedValue({ data: mockData });

    const result = await courseAPI.updateStudentCount(1, 201);

    expect(apiClient.patch).toHaveBeenCalledWith(`${COURSES.createCourse}/1`, {
      students: 201,
    });
    expect(result).toEqual(mockData);
  });

  test("deleteCourse calls DELETE and returns data", async () => {
    const mockData = { success: true };
    apiClient.delete.mockResolvedValue({ data: mockData });

    const result = await courseAPI.deleteCourse(1);

    expect(apiClient.delete).toHaveBeenCalledWith(`${COURSES.createCourse}/1`);
    expect(result).toEqual(mockData);
  });

  test("getCourses returns course list", async () => {
    const mockData = [{ id: 1, title: "Course" }];
    apiClient.get.mockResolvedValue({ data: mockData });

    const result = await courseAPI.getCourses();

    expect(apiClient.get).toHaveBeenCalledWith(COURSES.getCourse);
    expect(result).toEqual(mockData);
  });

  test("getCourses throws API error response", async () => {
    apiClient.get.mockRejectedValue({
      response: { data: "API Error" },
    });

    await expect(courseAPI.getCourses()).rejects.toBe("API Error");
  });

  test("getCourseById returns course data", async () => {
    const mockData = { id: 1, title: "Course" };
    apiClient.get.mockResolvedValue({ data: mockData });

    const result = await courseAPI.getCourseById(1);

    expect(apiClient.get).toHaveBeenCalledWith(`${COURSES.getCourse}/1`);
    expect(result).toEqual(mockData);
  });

  test("getCourseById throws message if no response data", async () => {
    apiClient.get.mockRejectedValue({
      message: "Network Error",
    });

    await expect(courseAPI.getCourseById(1)).rejects.toBe("Network Error");
  });

  test("updateStudentCount throws API error response", async () => {
    apiClient.patch.mockRejectedValue({
      response: { data: "Update failed" },
    });

    await expect(courseAPI.updateStudentCount(1, 201)).rejects.toBe(
      "Update failed"
    );
  });

  test("enrollInCourse returns enrolled course data", async () => {
    const payload = { userId: 1, courseId: 2 };
    const mockData = { success: true };

    apiClient.post.mockResolvedValue({ data: mockData });

    const result = await courseAPI.enrollInCourse(payload);

    expect(apiClient.post).toHaveBeenCalledWith(
      COURSES.enrollInCourse,
      payload
    );
    expect(result).toEqual(mockData);
  });

  test("enrollInCourse throws API error", async () => {
    apiClient.post.mockRejectedValue({
      response: { data: "Enroll failed" },
    });

    await expect(courseAPI.enrollInCourse({})).rejects.toBe("Enroll failed");
  });

  test("getEnrolledCourse returns enrolled course list", async () => {
    const mockData = [{ id: 1, course: { title: "React" } }];
    apiClient.get.mockResolvedValue({ data: mockData });

    const result = await courseAPI.getEnrolledCourse(1);

    expect(apiClient.get).toHaveBeenCalledWith(
      `${COURSES.enrollInCourse}?userId=1&_expand=course`
    );
    expect(result).toEqual(mockData);
  });

  test("getEnrolledCourse throws error message", async () => {
    apiClient.get.mockRejectedValue({
      message: "Fetch failed",
    });

    await expect(courseAPI.getEnrolledCourse(1)).rejects.toBe("Fetch failed");
  });
});
