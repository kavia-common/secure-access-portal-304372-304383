import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders app brand", () => {
  render(<App />);
  const brand = screen.getAllByText(/Secure Access Portal/i)[0];
  expect(brand).toBeInTheDocument();
});
