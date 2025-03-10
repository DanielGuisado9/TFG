export const mockRequest = (body = {}, params = {}, query = {}) => ({
    body,
    params,
    query,
    user: { id: "testUserId", role: "user" }, // Simulación de usuario autenticado
  });
  
  export const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };
  