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

class DCAPopupViewModel: ObservableObject {
    @Published var isLoading = false
    private let api = CSApi()

    @MainActor
    func updateDcaConfig() async {
        try? await Task.sleep(nanoseconds: 1_500_000_000)
        let config = CSApi.DcaConfig(account: "0x0", inputAmount: "10000")
        let success = try? await api.putDcaConfig(config)
        print("Updated DCA config with success: \(success ?? false)")
    }
}

struct DCAPopup: View {
    @Binding var isPresented: Bool
    @State private var amount: String = ""
    @State private var selectedOption: Selection = .daily
    @State private var isLoading = false
    @ObservedObject var viewModel = DCAPopupViewModel()

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
                    Task.init {
                        isLoading = true
                        await viewModel.updateDcaConfig()
                        isLoading = false
                    }
                }) {
                    ZStack {
                        if isLoading {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        } else {
                            Text("Start")
                                .fontWeight(.bold)
                        }
                    }
                    .padding()
                    .frame(width: 150, height: 60)
                    .background(CSColor.blue)
                    .foregroundColor(.white)
                    .cornerRadius(30)
                    .shadow(color: .gray.opacity(0.5), radius: 10, x: 5, y: 5)
                }
            }
            .padding(20)
        }
    }
}
