//
//  Launch.swift
//  coinsave
//
//  Created by Jann Driessen on 04.02.25.
//

import SwiftUI

class LaunchViewModel: ObservableObject {
    @Published var isLoading = false
    private let api = CSApi()

    @MainActor
    func createAgent() async {
        isLoading = true
        try? await Task.sleep(nanoseconds: 1_500_000_000)
        guard let account = try? await api.postInitAgent() else { return }
        print("Created agent with address: \(account)")
        UserStore.accountAddress = account
        isLoading = false
    }
}

struct Launch: View {
    @Binding var shouldTransition: Bool
    @ObservedObject private var viewModel = LaunchViewModel()

    var body: some View {
        ZStack {
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(red: 157/255, green: 160/255, blue: 156/255),
                    CSColor.white
                ]),
                startPoint: .top,
                endPoint: .bottom
            ).ignoresSafeArea()
            VStack {
                Spacer()
                Image("smartsave-logo")
                    .resizable()                          
                    .aspectRatio(contentMode: .fill)
                    .frame(width: 150, height: 150)
//                    .clipShape(Circle())
                Text("smartsave")
                    .foregroundStyle(CSColor.black)
                    .font(.system(size: 36))
                    .bold()
                    .shadow(radius: 8)
                    .padding(.top, 16)
                Spacer()
                Button(action: {
                    Task {
                        await viewModel.createAgent()
                        withAnimation(.easeIn) {
                            shouldTransition = true
                        }
                    }
                }) {
                    ZStack {
                        if viewModel.isLoading {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        } else {
                            Text("Get Started")
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
                .buttonStyle(PlainButtonStyle())
                .disabled(viewModel.isLoading)
            }
            .padding()
        }
    }
}
