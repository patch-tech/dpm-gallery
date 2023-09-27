using AppEngagement;

namespace ExampleCSharp {
    public class ExampleCSharp {
        static void Main(string[] args) {
            var Age = FactsAppEngagement.Fields.Age;
            var Gender = FactsAppEngagement.Fields.Gender;

            var query = FactsAppEngagement.Select(
                Age,
                Gender
            ).Limit(5);

            var results = query.Execute().GetAwaiter().GetResult();

            Console.WriteLine($"Results = {results}");
        }
    }
}