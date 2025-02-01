//
//  Colors.swift
//  coinsave
//
//  Created by Jann Driessen on 31.01.25.
//

import Foundation
import SwiftUI

enum CSColor {
    static let black = Color(hex: 0x1F2024)
    static let blue = Color(hex: 0x0052FF)
    static let darkBlue = Color(hex: 0x003ECB)
    static let gray = Color(hex: 0xA8ACB9)
    static let darkGray = Color(hex: 0x737783)
    static let white = Color(hex: 0xFFFFFF)
}

// MARK: - Color Extensions

extension Color {
    init(hex: UInt, alpha: Double = 1) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xff) / 255,
            green: Double((hex >> 08) & 0xff) / 255,
            blue: Double((hex >> 00) & 0xff) / 255,
            opacity: alpha
        )
    }

    init(light: Color, dark: Color) {
      self.init(UIColor(light: UIColor(light), dark: UIColor(dark)))
    }
}

extension UIColor {
  convenience init(light: UIColor, dark: UIColor) {
    self.init { traitCollection in
      switch traitCollection.userInterfaceStyle {
      case .light, .unspecified:
        return light
      case .dark:
        return dark
      @unknown default:
        return light
      }
    }
  }
}
