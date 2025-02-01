//
//  BackgroundAnimation.swift
//  coinsave
//
//  Created by Jann Driessen on 01.02.25.
//  Copied from previous project. Adjusted to needs of this one.
//

import SwiftUI

struct BackgroundAnimation: View {
    var animate: Bool = false
    var startAngle: CGFloat = 0
    @State private var endAngle: Double = 250
    var body: some View {
        VStack(alignment: .center) {
            BlurredPolyShape(startAngle: startAngle, endAngle: endAngle)
        }
        .onAppear {
            if animate {
                withAnimation(.linear(duration: 12.0).repeatForever(autoreverses: true)) {
                    endAngle = 0
                }
            }
        }
    }
}

private struct BlurredPolyShape: View {
    var startAngle: Double
    var endAngle: Double
    private let gradient = Gradient(colors: [.orange, .purple, CSColor.blue, .purple])
    var body: some View {
        PolygonShape(sides: 30)
            .fill(
                AngularGradient(
                    gradient: gradient,
                    center: .center,
                    startAngle: .degrees(startAngle),
                    endAngle: .degrees(endAngle)
                )
            )
            .frame(width: 150, height: 200)
            .blur(radius: 50)
    }
}

struct PolygonShape: Shape {
    var sides: Int

    func path(in rect: CGRect) -> Path {
        // hypotenuse
        let h = Double(min(rect.size.width, rect.size.height)) / 2.0

        // center
        let c = CGPoint(x: rect.size.width / 2.0, y: rect.size.height / 2.0)

        var path = Path()

        for i in 0..<sides {
            let angle = (Double(i) * (360.0 / Double(sides))) * Double.pi / 180

            // Calculate vertex position
            let pt = CGPoint(x: c.x + CGFloat(cos(angle) * h), y: c.y + CGFloat(sin(angle) * h))

            if i == 0 {
                path.move(to: pt) // move to first vertex
            } else {
                path.addLine(to: pt) // draw line to next vertex
            }
        }

        path.closeSubpath()

        return path
    }
}
