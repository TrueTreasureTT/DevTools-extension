#include <cstdint>
#include <iostream>
#include <string>

// Minimal Chrome Native Messaging host for DevToolsUB.
// It does not bypass ChromeOS/admin policy or enable Chrome's built-in DevTools.
// It provides a local native bridge for the extension's optional switch.

static bool read_message(std::string& message) {
  std::uint32_t length = 0;
  if (!std::cin.read(reinterpret_cast<char*>(&length), sizeof(length))) return false;
  message.resize(length);
  return static_cast<bool>(std::cin.read(message.data(), length));
}

static void write_message(const std::string& message) {
  const std::uint32_t length = static_cast<std::uint32_t>(message.size());
  std::cout.write(reinterpret_cast<const char*>(&length), sizeof(length));
  std::cout.write(message.data(), message.size());
  std::cout.flush();
}

int main() {
  std::string request;
  while (read_message(request)) {
    if (request.find("enable") != std::string::npos) {
      write_message(R"({"ok":true,"enabled":true,"mode":"native-bridge"})");
    } else if (request.find("disable") != std::string::npos) {
      write_message(R"({"ok":true,"enabled":false,"mode":"native-bridge"})");
    } else {
      write_message(R"({"ok":true,"enabled":true,"mode":"native-bridge"})");
    }
  }
  return 0;
}
