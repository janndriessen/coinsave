//
//  DCAPopup.swift
//  coinsave
//
//  Created by Jann Driessen on 03.02.25.
//

import SwiftUI

enum Selection: String, CaseIterable, Identifiable {
    case daily = "Daily"
    case weekly = "Weekly"
    case monthly = "Monthly"

    var id: String { self.rawValue }
}

struct DCAPopup: View {
    @Binding var isPresented: Bool
    @State private var amount: String = ""
    @State private var selectedOption: Selection = .daily

    var body: some View {
        ZStack {
            CSColor.white.edgesIgnoringSafeArea(.all)
            VStack(spacing: 20) {
                Text("Save Bitcoin on autopilot - powered by AI agents.")
                    .multilineTextAlignment(.leading)
                    .font(.system(size: 32))
                    .foregroundColor(CSColor.black)
                    .bold()
                    .padding(.top, 32)
                    .frame(maxWidth: .infinity)
                Text("Select a frequency and USDC amount to invest.")
                    .font(.system(size: 16))
                    .foregroundStyle(CSColor.black)
                TextField("10.00", text: $amount)
                    .font(.system(size: 64))
                    .textFieldStyle(PlainTextFieldStyle())
                    .keyboardType(.decimalPad)
                Picker("Select Frequency", selection: $selectedOption) {
                    ForEach(Selection.allCases) { option in
                        Text(option.rawValue).tag(option)
                    }
                }
                .pickerStyle(SegmentedPickerStyle())
                Spacer()
                Button(action: {
                    isPresented.toggle()
                }) {
                    Text("Start")
                        .foregroundColor(.white)
                        .padding()
                        .frame(minWidth: 150)
                        .background(CSColor.blue)
                        .cornerRadius(30)
                }
            }
            .padding(20)
        }
    }
}
