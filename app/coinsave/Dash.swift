//
//  Dash.swift
//  coinsave
//
//  Created by Jann Driessen on 31.01.25.
//

import SwiftUI

struct Dash: View {
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
                        Text("0.000005")
                            .font(.system(size: 32))
                            .foregroundStyle(CSColor.black)
                    }
                    .padding(.horizontal, 20)
                    Spacer()
                }
                .padding(.top, 40)
                HStack {
                    Bars()
                    Bars()
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
                                    Text("Start saving Bitcoin for the best price on autopilot with coinsave.")
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
                    TransactionListItem()
                    TransactionListItem()
                    TransactionListItem()
                    TransactionListItem()
                    TransactionListItem()
                }
                .padding(.horizontal)
                .padding(.vertical, 32)
                Spacer()
            }
            .frame(maxWidth: .infinity)
        }
        .ignoresSafeArea(edges: .bottom)
        .sheet(isPresented: $showModal) {
            DCAPopup(isPresented: $showModal)
        }
    }
}

struct TransactionListItem: View {
    @State private var currentDate = Date()
    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(dateString(from: currentDate))
                    .font(.headline)
                    .foregroundStyle(CSColor.black)
                Text(timeString(from: currentDate))
                    .font(.subheadline)
                    .foregroundStyle(CSColor.darkGray)
            }
            Spacer()
            VStack(alignment: .trailing) {
                Text("cbBTC")
                    .font(.headline)
                    .foregroundStyle(CSColor.blue)
                Text("0.000001")
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
