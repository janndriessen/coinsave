//
//  Bars.swift
//  coinsave
//
//  Created by Jann Driessen on 31.01.25.
//

import SwiftUI

struct Bars: View {
    let data: [Double] = [10, 25, 40, 30, 50, 20, 35]
    let labels: [String] = ["25", "26", "27", "28", "29", "30", "31"]
    let highlightedIndex: Int = 6

    var body: some View {
        VStack {
            HStack(alignment: .bottom, spacing: 8) {
                ForEach(data.indices, id: \.self) { index in
                    VStack {
                        Rectangle()
                            .fill(index == highlightedIndex ? CSColor.blue : CSColor.gray)
                            .frame(width: 8, height: CGFloat(data[index]) * 3)
                        Text(labels[index])
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
    Bars()
}
