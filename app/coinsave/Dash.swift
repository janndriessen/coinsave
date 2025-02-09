//
//  Dash.swift
//  coinsave
//
//  Created by Jann Driessen on 31.01.25.
//

import BasedUtils
import BigInt
import SwiftUI

class DashViewModel: ObservableObject {
    @Published var formattedBalance = ""
    @Published var transactions = [CSApi.Transaction]()
    private let api = CSApi()

    var bars: [Bar] {
        return transactions.reversed().map {
            return Bar(data: (Double($0.amount) ?? 0.0) / 20, label: String($0.dateFormatted.split(separator: "-")[2]))
        }
    }

    @MainActor
    func fetchData() {
        Task.init {
            // test address
//            let account = "0xb125E6687d4313864e53df431d5425969c15Eb2F"
            let account = UserStore.accountAddress
            let balance = (try? await api.getBalance(for: account)) ?? "-"
            formattedBalance = balance
            let transactions = (try? await api.getTransactions(for: account)) ?? []
            self.transactions = transactions
        }
    }
}

struct Dash: View {
    @ObservedObject var viewModel = DashViewModel()
    @State private var showModal = false

    var body: some View {
        ScrollView {
            VStack {
                HStack {
                    VStack(alignment: .leading) {
                        Text("cbBTC")
                            .font(.system(size: 38))
                            .foregroundStyle(CSColor.blue)
                            .bold()
                        Text(viewModel.formattedBalance)
                            .font(.system(size: 32))
                            .foregroundStyle(CSColor.black)
                    }
                    .padding(.horizontal, 20)
                    Spacer()
                }
                .padding(.top, 40)
                HStack {
                    Bars(data: viewModel.bars)
                }
                .padding(.bottom, 48)
                ZStack {
                    HStack {
                        BackgroundAnimation()
                            .frame(height: 50)
                            .opacity(0.5)
                        Spacer()
                    }
                    RoundedRectangle(cornerRadius: 25)
                        .fill(CSColor.gray.opacity(0.1))
                        .frame(height: 150)
                        .overlay(
                            ZStack(alignment: .leading) {
                                VStack(alignment: .leading) {
                                    Text("Start saving Bitcoin for the best price on autopilot with smartsave.")
                                        .font(.system(size: 20))
                                        .foregroundColor(CSColor.black)
                                    Spacer()
                                    HStack(alignment: .bottom) {
                                        Text("Powered by AI agents.")
                                            .font(.system(size: 16))
                                            .foregroundColor(CSColor.black)
                                        Spacer()
                                        Text("Start")
                                            .padding(.horizontal, 20)
                                            .padding(.vertical, 10)
                                            .background(CSColor.blue)
                                            .cornerRadius(30)
                                            .font(.system(size: 14))
                                            .foregroundColor(CSColor.white)
                                            .shadow(color: .white, radius: 2)
                                            .bold()
                                    }
                                }
                                .padding(24)
                            }
                        )
                        .shadow(color: CSColor.white, radius: 8)
                        .onTapGesture {
                            showModal.toggle()
                        }
                }
                .padding(.horizontal, 20)
                //                Rectangle()
                //                    .fill(CSColor.black)
                //                    .padding(.top, 20)
                VStack {
                    ForEach(viewModel.transactions.indices, id: \.self) { index in
                        TransactionListItem(
                            transaction: viewModel.transactions[index]
                        )
                    }
                }
                .padding(.horizontal)
                .padding(.vertical, 32)
                Spacer()
            }
            .frame(maxWidth: .infinity)
        }
        .ignoresSafeArea(edges: .bottom)
        .onAppear {
            viewModel.fetchData()
        }
        .sheet(isPresented: $showModal) {
            DCAPopup(isPresented: $showModal)
        }
    }
}

struct TransactionListItem: View {
    let transaction: CSApi.Transaction
    @State private var currentDate = Date()
    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(transaction.dateFormatted)
                    .font(.headline)
                    .foregroundStyle(CSColor.black)
                Text(transaction.timeFormatted)
                    .font(.subheadline)
                    .foregroundStyle(CSColor.darkGray)
            }
            Spacer()
            VStack(alignment: .trailing) {
                Text("cbBTC")
                    .font(.headline)
                    .foregroundStyle(CSColor.blue)
                Text(BasedUtils.formatUnits(BigInt(transaction.amount) ?? BigInt(0), 8))
                    .font(.subheadline)
                    .foregroundStyle(CSColor.darkGray)
            }
        }
        .padding(.bottom, 8)
    }

    private func dateString(from date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: date)
    }

    private func timeString(from date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm:ss"
        return formatter.string(from: date)
    }
}

#Preview {
    Dash()
}
