//
//  Bars.swift
//  coinsave
//
//  Created by Jann Driessen on 31.01.25.
//

import SwiftUI

struct Bar {
    let data: Double
    let label: String
}

struct Bars: View {
    let data: [Bar]
//    let data: [Double] = [10, 25, 40, 30, 50, 20, 35]
//    let labels: [String] = ["25", "26", "27", "28", "29", "30", "31"]

    var highlightedIndex: Int {
        return data.count - 1
    }

    var body: some View {
        VStack {
            HStack(alignment: .bottom, spacing: 8) {
                ForEach(data.indices, id: \.self) { index in
                    VStack {
                        Rectangle()
                            .fill(index == highlightedIndex ? CSColor.blue : CSColor.gray)
                            .frame(width: 8, height: CGFloat(data[index].data) * 3)
                        Text(data[index].label)
                            .font(.caption)
                            .foregroundStyle(CSColor.gray)
                            .rotationEffect(.degrees(-90))
                            .offset(y: 10)
                    }
                }
            }
            .padding(.top, 20)
        }
    }
}

#Preview {
    Bars(data: [
        Bar(data: 10, label: "25"),
        Bar(data: 25, label: "26"),
        Bar(data: 40, label: "27"),
        Bar(data: 30, label: "28"),
        Bar(data: 50, label: "29"),
        Bar(data: 20, label: "30"),
        Bar(data: 35, label: "31")
    ])
}
