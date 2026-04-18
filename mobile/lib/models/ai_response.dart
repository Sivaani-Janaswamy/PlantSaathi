class AiAnswer {
  final String question;
  final String answer;
  bool get isFallback => answer.trim() == 'AI service busy, try again later';

  const AiAnswer({
    required this.question,
    required this.answer,
  });

  factory AiAnswer.fromJson(Map<String, dynamic> json) {
    return AiAnswer(
      question: json['question']?.toString() ?? '',
      answer: json['answer']?.toString() ?? '',
    );
  }
}
